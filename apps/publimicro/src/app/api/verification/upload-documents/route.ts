import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * POST /api/verification/upload-documents
 * Upload verification documents (ID front/back, selfie, proof of address)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado.' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const documentFront = formData.get('document_front') as File | null;
    const documentBack = formData.get('document_back') as File | null;
    const selfie = formData.get('selfie') as File | null;
    const proofOfAddress = formData.get('proof_of_address') as File | null;
    const documentType = formData.get('document_type') as string;
    const documentNumber = formData.get('document_number') as string;

    // Validate required files
    if (!documentFront || !selfie) {
      return NextResponse.json(
        { error: 'Frente do documento e selfie são obrigatórios.' },
        { status: 400 }
      );
    }

    // Get verification record
    const { data: verification, error: verifyError } = await supabase
      .from('user_verifications')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (verifyError || !verification) {
      return NextResponse.json(
        { error: 'Verificação não encontrada. Inicie a verificação primeiro.' },
        { status: 404 }
      );
    }

    if (verification.status === 'approved') {
      return NextResponse.json(
        { error: 'Você já está verificado.' },
        { status: 400 }
      );
    }

    // Upload files to Supabase Storage
    const uploadedFiles: { [key: string]: string } = {};

    // Upload document front
    const frontFileName = `${user.id}/document-front-${Date.now()}.${documentFront.name.split('.').pop()}`;
    const { data: frontData, error: frontError } = await supabase.storage
      .from('verification-documents')
      .upload(frontFileName, documentFront, {
        contentType: documentFront.type,
        upsert: true,
      });

    if (frontError) {
      console.error('Error uploading document front:', frontError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload da frente do documento.' },
        { status: 500 }
      );
    }

    const { data: { publicUrl: frontUrl } } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(frontFileName);
    uploadedFiles.document_front_url = frontUrl;

    // Upload document back (if provided)
    if (documentBack) {
      const backFileName = `${user.id}/document-back-${Date.now()}.${documentBack.name.split('.').pop()}`;
      const { data: backData, error: backError } = await supabase.storage
        .from('verification-documents')
        .upload(backFileName, documentBack, {
          contentType: documentBack.type,
          upsert: true,
        });

      if (!backError) {
        const { data: { publicUrl: backUrl } } = supabase.storage
          .from('verification-documents')
          .getPublicUrl(backFileName);
        uploadedFiles.document_back_url = backUrl;
      }
    }

    // Upload selfie
    const selfieFileName = `${user.id}/selfie-${Date.now()}.${selfie.name.split('.').pop()}`;
    const { data: selfieData, error: selfieError } = await supabase.storage
      .from('verification-documents')
      .upload(selfieFileName, selfie, {
        contentType: selfie.type,
        upsert: true,
      });

    if (selfieError) {
      console.error('Error uploading selfie:', selfieError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload da selfie.' },
        { status: 500 }
      );
    }

    const { data: { publicUrl: selfieUrl } } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(selfieFileName);
    uploadedFiles.selfie_url = selfieUrl;

    // Upload proof of address (if provided)
    if (proofOfAddress) {
      const addressFileName = `${user.id}/proof-of-address-${Date.now()}.${proofOfAddress.name.split('.').pop()}`;
      const { data: addressData, error: addressError } = await supabase.storage
        .from('verification-documents')
        .upload(addressFileName, proofOfAddress, {
          contentType: proofOfAddress.type,
          upsert: true,
        });

      if (!addressError) {
        const { data: { publicUrl: addressUrl } } = supabase.storage
          .from('verification-documents')
          .getPublicUrl(addressFileName);
        uploadedFiles.proof_of_address_url = addressUrl;
      }
    }

    // Update verification record with document URLs
    const { error: updateError } = await supabase
      .from('user_verifications')
      .update({
        document_type: documentType,
        document_number: documentNumber,
        ...uploadedFiles,
        updated_at: new Date().toISOString(),
      })
      .eq('id', verification.id);

    if (updateError) {
      throw updateError;
    }

    // Log event
    await supabase.from('verification_audit_log').insert({
      user_verification_id: verification.id,
      user_id: user.id,
      event_type: 'document_uploaded',
      performed_by: user.id,
      performed_by_type: 'user',
      event_data: {
        document_type: documentType,
        files_uploaded: Object.keys(uploadedFiles),
      },
    });

    return NextResponse.json({
      message: 'Documentos enviados com sucesso.',
      uploaded_files: Object.keys(uploadedFiles),
      next_step: 'automated_checks',
    });

  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar documentos. Tente novamente.' },
      { status: 500 }
    );
  }
}
